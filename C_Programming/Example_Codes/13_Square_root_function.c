#include<stdio.h>
#include<math.h>
int main (void){
    double n ,s;
    printf("Enter a number: ");
    scanf("%lf", &n); //and yeah its L over here lf not one f (long float)
    s = sqrt(n);
    printf("Square root of %.2lf is %.2lf\n", n, s);
    
}