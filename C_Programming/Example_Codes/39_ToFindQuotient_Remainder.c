#include<stdio.h>
int main(void){
    int x, y, quo, rem;
    printf("Enter two numbers: ");
    scanf("%d%d", &x, &y);
    if (y)
    {
        quo = x/y;
        rem = x%y;
        printf("Quotient: %d, Remainder: %d\n", quo, rem);

    }
    else{
        printf("Divide by zero is error\n");
    return 0;
    }
}