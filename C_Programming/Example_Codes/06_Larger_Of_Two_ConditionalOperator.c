//CONDITIONAL OPERATOR EXAMPLE....CONDITION? CONDITION 1 : CONDITION 2
#include<stdio.h>
int main(void){
    int a, b, max;
    printf("Enter the value for a and b: ");
    scanf("%d%d", &a, &b);
    max = a>b ? a:b; /*Ternary operator OR Conditional operator*/
    printf("Larger of %d and %d is %d\n", a, b, max);
    return 0;
}